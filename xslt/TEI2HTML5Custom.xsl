<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
  xmlns:xs="http://www.w3.org/2001/XMLSchema"
  xmlns:t="http://www.tei-c.org/ns/1.0"
  exclude-result-prefixes="xs t"
  version="2.0">
  <xsl:output indent="no" omit-xml-declaration="yes" method="html"/>
  
  <xsl:param name="base"></xsl:param><!-- http://digitallatin.github.io/viewer/ -->
  
  <xsl:template match="/">
    <xsl:text disable-output-escaping="yes">&lt;!DOCTYPE html&gt;</xsl:text>
    <html>
      <head>
        <link rel="stylesheet" href="{$base}css/tei-html.css"/>
        <link rel="stylesheet" href="{$base}js/jquery-ui-1.11.4.custom/jquery-ui.css"/>
        <script type="text/javascript" src="{$base}js/elements.js"></script>
        <script type="text/javascript" src="{$base}js/jquery/jquery-1.11.3.js"></script>
        <script type="text/javascript" src="{$base}js/jquery-ui-1.11.4.custom/jquery-ui.js"></script>
        <script type="text/javascript" src="{$base}js/display.js"></script>
        <script type="text/javascript" src="{$base}js/appcrit.js"></script>
      </head>
      <body>
        <div id="navigation">
          <h2>Contents:</h2>
          <ul>
            <xsl:for-each select="//t:div[@type='textpart']">
              <li><a href="#{@xml:id}"><xsl:value-of select="t:head"/></a></li>
            </xsl:for-each>
          </ul>
        </div>
        <xsl:apply-templates/>
        <xsl:for-each select="//t:app">
          <div></div>
        </xsl:for-each>
      </body>
    </html>
  </xsl:template>
  
  <xsl:template match="*" xml:space="preserve"><xsl:element name="tei-{local-name(.)}"><xsl:apply-templates select="@*"/><xsl:apply-templates select="node()"/></xsl:element></xsl:template>
  
  <xsl:template match="t:app|t:lem|t:rdg" xml:space="preserve"><xsl:element name="tei-{local-name(.)}"><xsl:attribute name="id" select="generate-id()"/><xsl:apply-templates select="@*"/><xsl:apply-templates select="node()"/></xsl:element><span class="source"><xsl:text> </xsl:text><xsl:call-template name="sources"><xsl:with-param name="id" select="generate-id()"/></xsl:call-template></span></xsl:template>
  
  <xsl:template match="@xml:id">
    <xsl:attribute name="id"><xsl:value-of select="."/></xsl:attribute>
  </xsl:template>
  
  <xsl:template match="@xml:lang">
    <xsl:attribute name="lang"><xsl:value-of select="."/></xsl:attribute>
  </xsl:template>
  
  <xsl:template match="@xml:space">
    <xsl:attribute name="xml-space"><xsl:value-of select="."/></xsl:attribute>
  </xsl:template>
  
  <xsl:template match="@*">
    <xsl:copy-of select="."></xsl:copy-of>
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
  
  <xsl:template match="t:rdgGrp[@type='anteCorr']/t:rdg[1]"><xsl:element name="tei-{local-name(.)}"><xsl:attribute name="id" select="generate-id()"/><xsl:apply-templates select="@*"/><xsl:apply-templates select="node()"/></xsl:element><span> (corr.) </span>
  </xsl:template>
  
  <xsl:template match="t:app" mode="makedialog">
    <xsl:variable name="app"><xsl:apply-templates select="."/></xsl:variable>
    <div id="dialog-{replace($app/tei-app/@id,'copy','dialog')}" class="dialog" data-exclude="{@exclude}">
      <xsl:apply-templates select="$app" mode="dialog"/>
      <xsl:variable name="context" select="//t:TEI"/>
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
  
  <xsl:template match="*[id]" mode="dialog">
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
  
  <xsl:template match="tei-app[ancestor::tei-l]" mode="dialog"/>
  
  <xsl:template match="tei-lem[not(node())]|tei-rdg[not(node())]"><span>— </span></xsl:template>
  
  <xsl:template name="sources">
    <xsl:param name="id"/>
    <xsl:variable name="wits" select="tokenize(normalize-space(@wit),'\s+')"/>
    <xsl:variable name="sources" select="tokenize(normalize-space(@source),'\s+')"/>
    <xsl:variable name="context" select="/"/>
    <xsl:for-each select="$wits"><span class="ref" data-id="{$id}" data-ref="{.}"><xsl:value-of select="$context/id(substring-after(current(),'#'))/@n"/></span>
    </xsl:for-each>
    <xsl:text> </xsl:text>
    <xsl:for-each select="$sources"><span class="ref" data-id="{$id}" data-ref="{.}"><xsl:value-of select="$context/id(substring-after(current(),'#'))/@n"/></span>
    </xsl:for-each>
  </xsl:template>
  
</xsl:stylesheet>