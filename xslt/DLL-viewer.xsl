<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
    xmlns:xs="http://www.w3.org/2001/XMLSchema"
    xmlns:t="http://www.tei-c.org/ns/1.0"
    exclude-result-prefixes="xs t"
    version="2.0">
    
    <!-- Custom templates for DLL project viewer display. Does things like:
         * Eliminate ignorable whitespace where it might mess with punctuation
         * Insert HTML elements to augment or style TEI elements
    -->
    
    <xsl:variable name="context" select="//t:TEI"/>
    
    <xsl:template name="front">
        <div id="navigation">
            <h2>Contents:</h2>
            <ul>
                <xsl:for-each select="//t:div[@type='textpart']">
                    <li><a href="#{@xml:id}"><xsl:value-of select="t:head"/></a></li>
                </xsl:for-each>
                <li><a href="#sources">Sources</a></li>
            </ul>
        </div>
    </xsl:template>
    
    <xsl:template name="back">
        <xsl:apply-templates select="//t:app" mode="makedialog"/>
    </xsl:template>
    
    <!-- Return a tree with ignoreable whitespace removed-->
    <xsl:template match="*" mode="kill-ws">
        <xsl:copy>
            <xsl:copy-of select="@*"/>
            <xsl:choose>
                <xsl:when test="normalize-space(string-join(text(), '')) = ''">
                    <xsl:apply-templates select="*" mode="kill-ws"/>
                </xsl:when>
                <xsl:otherwise><xsl:apply-templates select="node()" mode="kill-ws"/></xsl:otherwise>
            </xsl:choose>
        </xsl:copy>
    </xsl:template>
    
    <xsl:template match="t:lem|t:rdg" mode="kill-ws">
        <xsl:copy>
            <xsl:apply-templates select="@*[not(local-name() = 'id')]"/>
            <xsl:if test="not(@xml:id)"><xsl:attribute name="xml:id" select="generate-id(.)"/></xsl:if>
            <xsl:choose>
                <xsl:when test="normalize-space(string-join(text(), '')) = ''">
                    <xsl:apply-templates select="*" mode="kill-ws"/>
                </xsl:when>
                <xsl:otherwise><xsl:apply-templates select="node()" mode="kill-ws"/></xsl:otherwise>
            </xsl:choose>
        </xsl:copy>
    </xsl:template>
    
    <!-- Exceptions where space should be preserved. -->
    <xsl:template match="t:respStmt" mode="kill-ws">
        <xsl:copy>
            <xsl:apply-templates select="@*"/>
            <xsl:apply-templates select="node()" mode="kill-ws"/>
        </xsl:copy>
    </xsl:template>
    
    <xsl:template match="t:teiHeader">
        <xsl:variable name="header"><xsl:apply-templates select="*" mode="kill-ws"/></xsl:variable>
        <xsl:element name="tei-teiHeader"><xsl:copy-of select="@*"/><xsl:apply-templates select="$header/*"/></xsl:element>
    </xsl:template>
        
    <xsl:template match="t:app">
        <xsl:variable name="app"><xsl:apply-templates select="*" mode="kill-ws"/></xsl:variable>
        <xsl:variable name="id"><xsl:choose>
            <xsl:when test="@xml:id"><xsl:value-of select="@xml:id"/></xsl:when>
            <xsl:otherwise><xsl:value-of select="generate-id(.)"/></xsl:otherwise>
        </xsl:choose></xsl:variable><xsl:element name="tei-app"><xsl:attribute name="id" select="$id"/><xsl:apply-templates select="@*[not(local-name() = 'id')]"/><xsl:apply-templates select="$app/*"/></xsl:element>
        </xsl:template>
    
    <xsl:template match="t:lem|t:rdg"><xsl:variable name="id"><xsl:choose>
        <xsl:when test="@xml:id"><xsl:value-of select="@xml:id"/></xsl:when>
        <xsl:otherwise><xsl:value-of select="generate-id()"/></xsl:otherwise>
    </xsl:choose></xsl:variable><xsl:element name="tei-{local-name(.)}"><xsl:attribute name="id" select="$id"/><xsl:apply-templates select="@*[not(local-name() = 'id')]"/><xsl:apply-templates select="node()"/></xsl:element><xsl:if test="@wit or @source"><span class="source"><xsl:if test="empty(node()) and not(@copyOf)"><xsl:text> om.</xsl:text></xsl:if><xsl:text> </xsl:text><xsl:call-template name="sources"><xsl:with-param name="id" select="$id"/></xsl:call-template></span></xsl:if></xsl:template>
    
    <xsl:template match="t:div[@type]">		
        <xsl:element name="tei-{local-name(.)}"><xsl:apply-templates select="@*"/><xsl:attribute name="class"><xsl:value-of select="@type"/></xsl:attribute><xsl:apply-templates select="node()"/></xsl:element>		
    </xsl:template>
    
    <xsl:template match="t:ptr">
        <tei-ptr>
            <xsl:apply-templates select="@*"/>
            <xsl:for-each select="tokenize(@target, '\s+')">
                <a href="{.}"><xsl:value-of select="substring-before(substring-after(., '://'), '/')"/></a><xsl:if test="position() != last()"><span>, </span></xsl:if>
            </xsl:for-each>
        </tei-ptr>
    </xsl:template>
    
    <!-- Embed an html:a[@href] inside t:ref for each @target. If there is a single target,
         wrap the contents of the ref in html:a[@href], otherwise, print the contents and 
         append a list of targets, like ptr.
    -->
    <xsl:template match="t:ref">
        <xsl:element name="tei-ref">
            <xsl:apply-templates select="@*"/>
            <xsl:choose>
                <xsl:when test="contains(@target, ' ')">
                    <xsl:apply-templates select="."/>
                    <span>[</span>
                    <xsl:for-each select="tokenize(@target, '\s+')">
                        <a href="{.}"><xsl:value-of select="substring-before(substring-after(., '://'), '/')"/></a><xsl:if test="position() != last()"><span>, </span></xsl:if>
                    </xsl:for-each>
                    <span>]</span>
                </xsl:when>
                <xsl:otherwise>
                    <a href="{@target}"><xsl:apply-templates select="node()"/></a>
                </xsl:otherwise>
            </xsl:choose>
        </xsl:element>
    </xsl:template>
    
    <xsl:template match="t:div[@type]">
        <xsl:element name="tei-{local-name(.)}"><xsl:apply-templates select="@*"/><xsl:attribute name="class"><xsl:value-of select="@type"/></xsl:attribute><xsl:apply-templates select="node()"/></xsl:element>
    </xsl:template>
    
    <xsl:template match="t:titleStmt/t:editor">
        <xsl:element name="tei-{local-name(.)}"><xsl:attribute name="id" select="generate-id()"/><xsl:apply-templates select="@*"/><xsl:apply-templates select="node()"/></xsl:element><xsl:choose>
            <xsl:when test="following-sibling::t:editor"><span>, </span></xsl:when>
            <xsl:otherwise>
                <xsl:choose>
                    <xsl:when test="preceding-sibling::t:editor"><span> edd.</span></xsl:when>
                    <xsl:otherwise><span> ed.</span></xsl:otherwise>
                </xsl:choose>
            </xsl:otherwise>
        </xsl:choose>
    </xsl:template>
    
    <!-- Start templates for styling source information -->
    <xsl:template match="t:msIdentifier">
        <tei-msIdentifier><xsl:apply-templates select="@*"/><xsl:for-each select="*"><xsl:apply-templates select="."/><xsl:if test="position() != last()"><span>, </span></xsl:if></xsl:for-each></tei-msIdentifier><span>. </span>
    </xsl:template>
    
    <xsl:template match="t:altIdentifier"><span> olim </span><tei-altIdentifier><xsl:apply-templates select="node()|@*"/></tei-altIdentifier></xsl:template>
    
    <!-- Re-order msDesc's content, so physical description comes before contents -->
    <xsl:template match="t:msDesc">
        <tei-msDesc>
            <xsl:choose>
                <xsl:when test="t:p"><xsl:apply-templates/></xsl:when>
                <xsl:otherwise>
                    <xsl:apply-templates select="t:msIdentifier"/>
                    <xsl:apply-templates select="t:history"/>
                    <xsl:apply-templates select="t:physDesc"/>
                    <xsl:apply-templates select="t:msContents"/>
                    <xsl:apply-templates select="t:additional"/>
                    <xsl:apply-templates select="t:msPart"/>
                </xsl:otherwise>
            </xsl:choose>
        </tei-msDesc>
    </xsl:template>
    
    <xsl:template match="t:support">
        <xsl:call-template name="make-element"/><span>, </span>
    </xsl:template>
    
    <xsl:template match="t:extent/t:measure[@unit='folios']">
        <span>constat foliis <xsl:value-of select="@quantity"/> </span><xsl:call-template name="make-element"/><span>, </span>
    </xsl:template>
    
    <xsl:template match="t:extent/t:dimensions">
        <tei-dimensions><xsl:apply-templates select="@*"/><xsl:apply-templates select="t:height"/><span>×</span><xsl:apply-templates select="t:width"/></tei-dimensions><span>, </span>
    </xsl:template>
    
    <xsl:template match="t:handDesc">
        <span>manus <xsl:value-of select="@hands"/>: </span><xsl:call-template name="make-element"/><span>. </span>
    </xsl:template>
    
    <xsl:template match="t:handNote"><xsl:if test="@n"><span><xsl:value-of select="@n"/> = </span></xsl:if><xsl:call-template name="make-element"/><xsl:if test="following-sibling::t:handNote"><span>; </span></xsl:if></xsl:template>
    
    <xsl:template match="t:layoutDesc"><xsl:call-template name="make-element"/><span><xsl:text> </xsl:text></span></xsl:template>
    
    <xsl:template match="t:origin"><xsl:call-template name="make-element"/><span>, </span></xsl:template>
    
    <xsl:template match="t:msContents"><span>continet </span><xsl:call-template name="make-element"/><span> </span></xsl:template>
    
    <xsl:template match="t:msItem"><xsl:call-template name="make-element"/><span><xsl:text> </xsl:text></span></xsl:template>
    
    <xsl:template match="t:msItem/t:title"><xsl:call-template name="make-element"/><xsl:choose><xsl:when test="../t:locus"><span> (<xsl:value-of select="../t:locus"/>), </span></xsl:when><xsl:otherwise><span>, </span></xsl:otherwise></xsl:choose></xsl:template>
    
    <xsl:template match="t:incipit"><span>incipit: </span><xsl:call-template name="make-element"/><span><xsl:text> </xsl:text></span></xsl:template>
    
    <xsl:template match="t:explicit"><span>explicit: </span><xsl:call-template name="make-element"/><span><xsl:text> </xsl:text></span></xsl:template>
    
    <xsl:template match="t:bibl/t:author[@ref]"><xsl:call-template name="make-element"/><span> [</span><xsl:for-each select="tokenize(@ref, '\s+')">
            <a href="{.}"><xsl:value-of select="substring-before(substring-after(., '://'), '/')"/></a><xsl:if test="position() != last()"><span>, </span></xsl:if>
        </xsl:for-each><span>]</span></xsl:template>
    
    <xsl:template match="t:bibl/t:author/t:persName/*"><span><xsl:text> </xsl:text></span><xsl:call-template name="make-element"/></xsl:template>
    
    <xsl:template match="t:bibl/t:editor/t:persName/*"><span><xsl:text> </xsl:text></span><xsl:call-template name="make-element"/></xsl:template>
    
    <xsl:template match="t:bibl/t:editor|t:bibl/t:title|t:pubPlace|t:publisher"><xsl:if test="preceding-sibling::t:*"><span>, </span></xsl:if><xsl:call-template name="make-element"/></xsl:template>
    
    <xsl:template match="t:bibl/t:date"><span> (</span><xsl:call-template name="make-element"/><span>). </span></xsl:template>
            
    <xsl:template name="make-element"><xsl:element name="tei-{local-name(.)}"><xsl:apply-templates select="@*"/><xsl:apply-templates select="node()"/></xsl:element></xsl:template>
    
    <!-- End templates for styling source information -->
    
    <!-- Match special apparatus structures and insert HTML for them -->
    <xsl:template match="t:rdgGrp[@type='anteCorr']/t:rdg[1]"><xsl:element name="tei-{local-name(.)}"><xsl:attribute name="id" select="generate-id()"/><xsl:apply-templates select="@*"/><xsl:apply-templates select="node()"/></xsl:element><span> (corr.) </span>
    </xsl:template>
    
    <!-- Add labels for conspectus librorum -->
    <xsl:template match="t:witness[@n]">
        <xsl:element name="tei-{local-name()}">
            <xsl:apply-templates select="@*"/>
            <span><xsl:value-of select="@n"/> = </span><xsl:apply-templates select="node()"/>
        </xsl:element><xsl:if test="ancestor::t:witness and following-sibling::*[1]/local-name() = 'witness'"><span>, </span></xsl:if>
    </xsl:template>
    
    <xsl:template match="t:sourceDesc//t:bibl[@n]">
        <xsl:element name="tei-{local-name()}">
            <xsl:apply-templates select="@*"/>
            <span><xsl:value-of select="@n"/> = </span><xsl:apply-templates select="node()"/>
        </xsl:element><xsl:if test="ancestor::t:bibl and following-sibling::*[1]/local-name() = 'bibl'"><span>, </span></xsl:if>
    </xsl:template>
    
    <xsl:template match="t:sourceDesc//t:biblStruct[@n]">
        <xsl:element name="tei-{local-name()}">
            <xsl:apply-templates select="@*"/>
            <span><xsl:value-of select="@n"/> = </span><xsl:apply-templates select="node()"/>
        </xsl:element><xsl:if test="ancestor::t:bibl and following-sibling::*[1]/local-name() = 'bibl'"><span>, </span></xsl:if>
    </xsl:template>
    
    <!-- Templates for generating apparatus dialogs -->
    <xsl:template match="t:app" mode="makedialog">
        <xsl:variable name="app"><xsl:apply-templates select="."/></xsl:variable>
        <div id="dialog-{replace($app/tei-app/@id,'copy','dialog')}" class="dialog" data-exclude="{@exclude}" style="display:none;">
            <xsl:apply-templates select="$app/*" mode="dialog"/>
            <xsl:for-each select="tokenize(@exclude,'\s+')">
                <xsl:apply-templates select="$context/id(substring-after(current(),'#'))"/>
            </xsl:for-each>
        </div>
    </xsl:template>
    
    <xsl:template match="node()|@*" mode="dialog">
        <xsl:copy>
            <xsl:apply-templates select="node()|@*" mode="dialog"/>
        </xsl:copy>
    </xsl:template>
    
    <xsl:template match="*[@id]" mode="dialog">
        <xsl:copy>
            <xsl:attribute name="data-id"><xsl:value-of select="@id"/></xsl:attribute>
            <xsl:copy-of select="@*[not(local-name(.) = 'id')]"/>
            <xsl:apply-templates mode="dialog"/>
        </xsl:copy>
    </xsl:template>
    
    <xsl:template match="tei-note" mode="dialog">
        <xsl:copy>
            <xsl:attribute name="data-id"><xsl:value-of select="substring-after(@target,'#')"/></xsl:attribute>
            <xsl:apply-templates select="node()|@*" mode="dialog"/>
        </xsl:copy>
    </xsl:template>
    
    <xsl:template match="tei-app[ancestor::tei-l]" mode="dialog" priority="100"/>
        
    <xsl:template name="sources">
        <xsl:param name="id"/>
        <xsl:variable name="wits" select="tokenize(normalize-space(@wit),'\s+')"/>
        <xsl:variable name="sources" select="tokenize(normalize-space(@source),'\s+')"/>
        <xsl:for-each select="$wits"><span class="ref" data-id="{$id}" data-ref="{.}"><xsl:value-of select="$context/id(substring-after(current(),'#'))/@n"/></span>
        </xsl:for-each>
        <xsl:text> </xsl:text>
        <xsl:for-each select="$sources"><span class="ref" data-id="{$id}" data-ref="{.}"><xsl:value-of select="$context/id(substring-after(current(),'#'))/@n"/></span>
        </xsl:for-each>
    </xsl:template>
</xsl:stylesheet>